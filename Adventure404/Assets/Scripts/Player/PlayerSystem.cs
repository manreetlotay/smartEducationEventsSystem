using UnityEngine;
using Unity.Entities;
using Unity.Transforms;
using Unity.Mathematics;
using Unity.Collections;

public partial struct PlayerSystem : ISystem
{
    private EntityManager entityManager;
    private Entity player;
    private Entity input;
    private PlayerComponent playerComponent;
    private InputComponent inputComponent;

    public void OnUpdate(ref SystemState state)
    {
        entityManager = state.EntityManager;
        player = SystemAPI.GetSingletonEntity<PlayerComponent>();
        input = SystemAPI.GetSingletonEntity<InputComponent>();

        playerComponent = entityManager.GetComponentData<PlayerComponent>(player);
        inputComponent = entityManager.GetComponentData<InputComponent>(input);


        Move(ref state);
    }

    private void Move(ref SystemState state)
    {
        LocalTransform playerTransform = entityManager.GetComponentData<LocalTransform>(player);
        playerTransform.Position += new float3(inputComponent.MoveVector * playerComponent.MoveSpeed * SystemAPI.Time.DeltaTime, 0f);

        if (inputComponent.MoveVector.y < 0.0f) {
            DownSprite(ref state);
        }
        else if (inputComponent.MoveVector.y > 0.0f)
        {
            UpSprite(ref state);
        }
        else
        {
            if (inputComponent.MoveVector.x > 0.0f)
            {
                RightSprite(ref state);
            }
            else
            {
                LeftSprite(ref state);
            }
        }

        entityManager.SetComponentData(player, playerTransform);
    }

    private void DownSprite(ref SystemState state)
    {

    }

    private void UpSprite(ref SystemState state)
    {

    }

    private void LeftSprite(ref SystemState state)
    {

    }

    private void RightSprite(ref SystemState state)
    {

    }

    private void FireMissile(ref SystemState state)
    {

    }
}
