function env(key) {
    let envKey = key + '__' + process.env.CI_ENVIRONMENT_SLUG;

    if (!process.env[envKey]) {
        console.error('Environment variable '+ envKey +' does not exist.')
        process.exit(1);
    }
    else {
        return process.env[envKey];
    }
}

function getEnvironmentKeyPairs(keys) {
    return keys.map((key) => {
        return {
            name: key,
            value: env(key),
        };
    });
}

let taskDefinition = {
    "volumes": [],
    "family": "webcaptioner-" + process.env.CI_ENVIRONMENT_SLUG,
    "executionRoleArn": "REMOVED",
    "networkMode": "awsvpc",
    "containerDefinitions": [
      {
        "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "/ecs/webcaptioner",
            "awslogs-region": "us-east-1",
            "awslogs-stream-prefix": "ecs"
          }
        },
        "portMappings": [
          {
            "hostPort": 8080,
            "protocol": "tcp",
            "containerPort": 8080
          }
        ],
        "cpu": 0,
        "memoryReservation": 300,
        "volumesFrom": [],
        "image": "REMOVED:" + process.env.CI_ENVIRONMENT_SLUG,
        "name": "webcaptioner",
        "environment": [
            ...getEnvironmentKeyPairs([
                'CHROME_EXTENSION_ID',
                'GOOGLE_CAST_APP_ID',
                'SENTRY_SECURITY_TOKEN',
            ]),
            {
                name: "HOSTNAME",
                value: process.env.CI_ENVIRONMENT_URL,
            },
        ]
      }
    ]
  };

console.log(JSON.stringify(taskDefinition));