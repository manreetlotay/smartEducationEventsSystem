using Unity.Entities;

public struct EnemySpawnerComponent : IComponentData
{
    public Entity EnemyToSpawn;
    public int SpawnPerWave;
    public int SpawnIncrement;
    public float SpawnDistance;

    public float TimeBetweenWaves;
    public float TimeToNextWave;
}
