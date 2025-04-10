using Unity.Entities;
using UnityEngine;

public class MissileStatsAuthoring : MonoBehaviour
{
    public int Speed = 20;
    public class MissileStatsBaker : Baker<MissileStatsAuthoring>
    {
        public override void Bake(MissileStatsAuthoring authoring)
        {
            Entity stats = GetEntity(TransformUsageFlags.Dynamic);
            AddComponent(stats, new MissileStatsComponent
            {
                Speed = authoring.Speed,
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
