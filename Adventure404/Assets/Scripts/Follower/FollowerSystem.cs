using Unity.Burst;
using Unity.Collections;
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;

partial struct FollowerSystem : ISystem
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
            if (entityManager.HasComponent<FollowerComponent>(e))
            {
                Follow(ref state, e);
            }
        }
    }

    private void Follow(ref SystemState state, Entity follower)
    {
        FollowerComponent followerComponent = entityManager.GetComponentData<FollowerComponent>(follower);
        LocalTransform followerTransform = entityManager.GetComponentData<LocalTransform>(follower);
        Entity target = followerComponent.Target;
        LocalTransform targetTransform = entityManager.GetComponentData<LocalTransform>(target);
        float3 direction = math.normalize(targetTransform.Position - followerTransform.Position);
    }

    [BurstCompile]
    public void OnDestroy(ref SystemState state)
    {
        
    }
}
