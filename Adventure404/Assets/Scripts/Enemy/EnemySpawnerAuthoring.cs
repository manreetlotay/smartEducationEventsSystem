using Unity.Entities;
using UnityEngine;

public class EnemySpawnerAuthoring : MonoBehaviour
{
    public GameObject EnemyToSpawn;
    public int SpawnPerWave = 60;
    public int SpawnIncrement = 1;
    public float SpawnDistance = 40f;

    public float TimeBetweenWaves = 2f;
    public class EnemySpawnerBaker : Baker<EnemySpawnerAuthoring>
    {
        public override void Bake(EnemySpawnerAuthoring authoring)
        {
            Entity spawner = GetEntity(TransformUsageFlags.Dynamic);
            AddComponent(spawner, new EnemySpawnerComponent
            {
                EnemyToSpawn = GetEntity(authoring.EnemyToSpawn, TransformUsageFlags.Dynamic),
                SpawnPerWave = authoring.SpawnPerWave,
                SpawnIncrement = authoring.SpawnIncrement,
                SpawnDistance = authoring.SpawnDistance,
                TimeBetweenWaves = authoring.TimeBetweenWaves,
                TimeToNextWave = authoring.TimeBetweenWaves
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
