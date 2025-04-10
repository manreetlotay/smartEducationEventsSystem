using Unity.Entities;

public struct PlayerComponent : IComponentData
{
    public float MoveSpeed;
    public Entity MissilePrefab;
    public int Coins;
    public float TimeSinceLastMissile;
    public float MissileCooldown;
}
