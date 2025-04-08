using Unity.Entities;

public struct PlayerComponent : IComponentData
{
    public float MoveSpeed;
    public Entity MissilePrefab;
}
