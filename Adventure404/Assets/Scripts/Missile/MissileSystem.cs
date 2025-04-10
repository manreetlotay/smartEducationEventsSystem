using Unity.Burst;
using Unity.Collections;
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Assertions.Must;
using static UnityEngine.GraphicsBuffer;

partial struct MissileSystem : ISystem
{
    [BurstCompile]
    public void OnCreate(ref SystemState state)
    {
        // Request access to components
        state.RequireForUpdate<MissileStatsComponent>();
    }

    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        // Get ECB system
        var ecbSystem = SystemAPI.GetSingleton<EndSimulationEntityCommandBufferSystem.Singleton>();
        // Create command buffer properly
        var ecb = ecbSystem.CreateCommandBuffer(state.WorldUnmanaged);

        // Get time once
        float deltaTime = SystemAPI.Time.DeltaTime;

        // Cache missile stats
        float missileSpeed = 0f;
        if (SystemAPI.HasSingleton<MissileStatsComponent>())
        {
            missileSpeed = SystemAPI.GetSingleton<MissileStatsComponent>().Speed;
        }

        // Use SystemAPI.Query instead of manual entity iteration
        foreach (var (missileTransform, missileComponent, entity) in
                 SystemAPI.Query<RefRW<LocalTransform>, RefRW<MissileComponent>>()
                         .WithEntityAccess())
        {
            Entity closestEnemy = FindClosestEnemy(ref state, missileTransform.ValueRO.Position);

            // Update target
            missileComponent.ValueRW.Target = closestEnemy;

            // If no valid target, just continue
            if (closestEnemy == Entity.Null)
            {
                continue;
            }

            // Get target position
            if (state.EntityManager.HasComponent<LocalTransform>(closestEnemy))
            {
                LocalTransform targetTransform = state.EntityManager.GetComponentData<LocalTransform>(closestEnemy);
                float3 distance = targetTransform.Position - missileTransform.ValueRO.Position;

                if (math.length(distance) < 0.5f)
                {
                    // Collision detected
                    ecb.DestroyEntity(closestEnemy);
                    ecb.DestroyEntity(entity);
                }
                else
                {
                    // Move missile
                    float3 direction = math.normalize(distance);
                    missileTransform.ValueRW.Position += direction * missileSpeed * deltaTime;
                }
            }
        }
    }

    private Entity FindClosestEnemy(ref SystemState state, float3 position)
    {
        Entity closestEnemy = Entity.Null;
        float closestDistanceSq = float.MaxValue;

        foreach (var (enemyTransform, enemy) in
                 SystemAPI.Query<RefRO<LocalTransform>>()
                         .WithAll<EnemyComponent>()
                         .WithEntityAccess())
        {
            float3 diff = enemyTransform.ValueRO.Position - position;
            float distanceSq = math.lengthsq(diff);

            if (distanceSq < closestDistanceSq)
            {
                closestDistanceSq = distanceSq;
                closestEnemy = enemy;
            }
        }

        return closestEnemy;
    }

    [BurstCompile]
    public void OnDestroy(ref SystemState state)
    {
    }
}