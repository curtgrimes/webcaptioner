ENV_VAR_SUFFIX="__${CI_ENVIRONMENT_SLUG}"
echo "hello script"
echo $ENV_VAR_SUFFIX
env | awk -F "=" '{print $1}' | grep "${ENV_VAR_SUFFIX}$"

for var in $(env | awk -F "=" '{print $1}' | grep "${ENV_VAR_SUFFIX}$")
do
    echo "var"
    echo ${var%${ENV_VAR_SUFFIX}}
    export ${var%${ENV_VAR_SUFFIX}}="${!var}"
done 

