using Unity.Entities;
using UnityEngine;

public class MissileAuthoring : MonoBehaviour
{
    public class MissileBaker : Baker<MissileAuthoring>
    {
        public override void Bake(MissileAuthoring authoring)
        {
            Entity missile = GetEntity(TransformUsageFlags.Dynamic);
            AddComponent(missile, new MissileComponent
            {
                Target = Entity.Null
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
