using UnityEngine;
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;

public class EnemyAuthoring : MonoBehaviour
{
    public class EnemyBaker : Baker<EnemyAuthoring>
    {
        public override void Bake(EnemyAuthoring authoring)
        {
            Entity enemy = GetEntity(TransformUsageFlags.Dynamic);
            AddComponent(enemy, new EnemyComponent());
            AddComponent(enemy, new HealthComponent
            {
                Health = 1,
            });
        }
    }

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }
}
