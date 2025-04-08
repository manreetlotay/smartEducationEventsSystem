using UnityEngine;
using Unity.Entities;
using Unity.Mathematics;
using Unity.Transforms;

public class PlayerAuthoring : MonoBehaviour
{
    public float MoveSpeed = 1f;
    public GameObject MissilePrefab;

    public class PlayerBaker : Baker<PlayerAuthoring>
    {
        public override void Bake(PlayerAuthoring authoring)
        {
            Entity player = GetEntity(TransformUsageFlags.Dynamic);
            AddComponent(player, new PlayerComponent
            {
                MoveSpeed = authoring.MoveSpeed,
                MissilePrefab = GetEntity(authoring.MissilePrefab, TransformUsageFlags.None)
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
