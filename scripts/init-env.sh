#!/usr/bin/env bash
ENV_VAR_SUFFIX="__${CI_ENVIRONMENT_SLUG}"

for var in $(env | awk -F "=" '{print $1}' | grep "${ENV_VAR_SUFFIX}$")
do
    export ${var%${ENV_VAR_SUFFIX}}="${!var}"
done 