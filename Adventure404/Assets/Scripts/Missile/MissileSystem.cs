using Unity.Burst;
using Unity.Collections;
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;

partial struct MissileSystem : ISystem
{
    private EntityManager entityManager;
    [BurstCompile]
    public void OnCreate(ref SystemState state)
    {

    }

    [BurstCompile]
    public void OnUpdate(ref SystemState state)
    {
        entityManager = state.EntityManager;

        NativeArray<Entity> entities = entityManager.GetAllEntities();

        foreach (Entity e in entities)
        {
            if (entityManager.HasComponent<MissileComponent>(e))
            {
                Follow(ref state, e);
            }
        }
    }

    private void Follow(ref SystemState state, Entity missile)
    {
        MissileComponent missileComponent = entityManager.GetComponentData<MissileComponent>(missile);
        LocalTransform missileTransform = entityManager.GetComponentData<LocalTransform>(missile);
        Entity target = missileComponent.Target;
        LocalTransform targetTransform = entityManager.GetComponentData<LocalTransform>(target);
        float3 direction = math.normalize(targetTransform.Position - missileTransform.Position);
        Entity missileStats = SystemAPI.GetSingletonEntity<MissileStatsComponent>();
        MissileStatsComponent missileStatsComponent = entityManager.GetComponentData<MissileStatsComponent>(missileStats);
        missileTransform.Position += direction * missileStatsComponent.Speed * SystemAPI.Time.DeltaTime;

        entityManager.SetComponentData(missile, missileTransform);
    }

    [BurstCompile]
    public void OnDestroy(ref SystemState state)
    {

    }
}
