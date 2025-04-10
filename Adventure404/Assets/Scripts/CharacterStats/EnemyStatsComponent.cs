using Unity.Entities;

public struct EnemyStatsComponent : IComponentData
{
    public int StartingHealth;
    public float MoveSpeed;
    public float SizeMultiplier;
    public int CoinsDropped;
}
