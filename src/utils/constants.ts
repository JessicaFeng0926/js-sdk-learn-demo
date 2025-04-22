import { FieldType } from "@lark-base-open/js-sdk";

export const REQUIRED_FIELDS = [
    "internal_id",
    "prompt",
    "uid",
    "task_id",
    "start_time",
    "end_time",
]

export const RESPONSE_REGEX = /^response_(\d+)$/;

export const LABEL_REGEX = /^label_(\d+)_(\w+)$/;

export enum IntoDBMethod {
    AllIn = 1,
    Custom = 2
}

export const INTO_DB_METHOD_OPTIONS = [
    {
        label: "全部入库",
        value: IntoDBMethod.AllIn
    },
    {
        label: "指定范围记录入库",
        value: IntoDBMethod.Custom
    }

]