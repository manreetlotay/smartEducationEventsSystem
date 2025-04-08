using UnityEngine;
using Unity.Entities;
using Unity.Mathematics;

public struct InputComponent : IComponentData
{
    public float2 MoveVector;
    public bool MissileIsPressed;
}
