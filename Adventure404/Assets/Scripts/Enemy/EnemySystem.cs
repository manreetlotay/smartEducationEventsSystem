using System.Numerics;
using Unity.Burst;
using Unity.Collections;
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;
using UnityEngine;

partial struct EnemySystem : ISystem
{
    private EntityManager entityManager;
    private Entity player;
    [BurstCompile]
    public void OnCreate(ref SystemState state)
    {
        
    }

    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        entityManager = state.EntityManager;
        player = SystemAPI.GetSingletonEntity<PlayerComponent>();
        LocalTransform playerTransform = entityManager.GetComponentData<LocalTransform>(player);

        NativeArray<Entity> entities = entityManager.GetAllEntities();

        foreach (Entity e in entities)
        {
            if (entityManager.HasComponent<EnemyComponent>(e))
            {
                MoveEnemy(ref state, e, playerTransform);
            }
        }
    }

    private void MoveEnemy(ref SystemState state, Entity enemy, LocalTransform playerTransform)
    {
        LocalTransform enemyTransform = entityManager.GetComponentData<LocalTransform>(enemy);
        Entity enemyStats = SystemAPI.GetSingletonEntity<EnemyStatsComponent>();
        EnemyStatsComponent enemyStatsComponent = entityManager.GetComponentData<EnemyStatsComponent>(enemyStats);
        float3 direction = math.normalize(playerTransform.Position - enemyTransform.Position);
        enemyTransform.Position += direction * enemyStatsComponent.MoveSpeed * SystemAPI.Time.DeltaTime;

        entityManager.SetComponentData(enemy, enemyTransform);
    }

    [BurstCompile]
    public void OnDestroy(ref SystemState state)
    {
        
    }
}
