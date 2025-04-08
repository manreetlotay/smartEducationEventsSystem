using UnityEngine;
using Unity.Burst;
using Unity.Entities;
using Unity.Mathematics;

public partial class InputSystem : SystemBase
{
    private Controls controls;

    protected override void OnCreate()
    {
        if (!SystemAPI.TryGetSingleton(out InputComponent inputComponent))
        {
            EntityManager.CreateEntity(typeof(InputComponent));
        }

        controls = new Controls();
        controls.Enable();
    }

    protected override void OnUpdate()
    {
        Vector2 moveVector = controls.Player.Move.ReadValue<Vector2>();
        bool missile = controls.Player.Missile.IsPressed();

        SystemAPI.SetSingleton(new InputComponent
        {
            MoveVector = moveVector,
            MissileIsPressed = missile
        });
    }
}
