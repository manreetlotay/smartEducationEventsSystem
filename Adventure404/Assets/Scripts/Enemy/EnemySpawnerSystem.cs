using System;
using System.Numerics;
using System.Runtime.CompilerServices;
using Unity.Burst;
using Unity.Collections;
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;
using UnityEngine;

partial struct EnemySpawnerSystem : ISystem
{
    private EntityManager entityManager;
    private Entity spawnerEntity;
    private EnemySpawnerComponent spawnerComponent;
    private Entity player;
    private Unity.Mathematics.Random random;

    [BurstCompile]
    public void OnCreate(ref SystemState state)
    {
        random = Unity.Mathematics.Random.CreateFromIndex(1);
    }

    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        entityManager = state.EntityManager;
        spawnerEntity = SystemAPI.GetSingletonEntity<EnemySpawnerComponent>();
        spawnerComponent = entityManager.GetComponentData<EnemySpawnerComponent>(spawnerEntity);
        player = SystemAPI.GetSingletonEntity<PlayerComponent>();

        Spawn(ref state);
    }

    private void Spawn(ref SystemState state)
    {
        spawnerComponent.TimeToNextWave -= SystemAPI.Time.DeltaTime;
        if (spawnerComponent.TimeToNextWave <= 0f)
        {
            spawnerComponent.TimeToNextWave = spawnerComponent.TimeBetweenWaves;
            EntityCommandBuffer entityCommandBuffer = new EntityCommandBuffer(Allocator.Temp);

            for (int i = 0; i < spawnerComponent.SpawnPerWave; i++)
            {
                Entity enemy = entityManager.Instantiate(spawnerComponent.EnemyToSpawn);

                LocalTransform enemyTransform = entityManager.GetComponentData<LocalTransform>(enemy);
                LocalTransform playerTransform = entityManager.GetComponentData<LocalTransform>(player);

                float2 randomOffset = math.normalize(random.NextFloat2Direction());

                randomOffset = math.clamp(randomOffset, new float2(-100f), new float2(100f));

                float2 playerPos = new float2(playerTransform.Position.x, playerTransform.Position.y);

                float2 spawnPos = playerPos + randomOffset * spawnerComponent.SpawnDistance;

                enemyTransform.Position = new float3(spawnPos, 0f);

                entityManager.SetComponentData(enemy, enemyTransform);
            }
            entityCommandBuffer.Playback(entityManager);
            entityCommandBuffer.Dispose();
        }
        entityManager.SetComponentData(spawnerEntity, spawnerComponent);
    }

    [BurstCompile]
    public void OnDestroy(ref SystemState state)
    {
        
    }
}
