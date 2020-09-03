docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG

docker run -i $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG /bin/bash

cd app
npm run tests