docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_NAME

docker run -it $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_NAME /bin/bash

cd app
npm run tests