using Unity.Entities;
using UnityEngine;

public class EnemyStatsAuthoring : MonoBehaviour
{
    public int StartingHealth;
    public float MoveSpeed;
    public float SizeMultiplier;
    public int CoinsDropped;
    public class EnemyStatsBaker : Baker<EnemyStatsAuthoring>
    {
        public override void Bake(EnemyStatsAuthoring authoring)
        {
            Entity statsManager = GetEntity(TransformUsageFlags.None);
            AddComponent(statsManager, new EnemyStatsComponent
            {
                StartingHealth = authoring.StartingHealth,
                MoveSpeed = authoring.MoveSpeed,
                SizeMultiplier = authoring.SizeMultiplier,
                CoinsDropped = authoring.CoinsDropped,
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