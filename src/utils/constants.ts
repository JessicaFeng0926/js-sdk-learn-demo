import { FieldType } from "@lark-base-open/js-sdk";

export const REQUIRED_FIELDS = [
    { title: "internal_id", valueType: [FieldType.Text, FieldType.Lookup] },
    { title: "prompt", valueType: [FieldType.Text, FieldType.Lookup] },
    { title: "uid", valueType: [FieldType.Text, FieldType.Lookup] },
    { title: "task_id", valueType: [FieldType.Text, FieldType.Lookup] },
    { title: "start_time", valueType: [FieldType.DateTime] },
    { title: "end_time", valueType: [FieldType.DateTime] },

]

export const RESPONSE_REGEX = /^response_(\d+)$/;

export const LABEL_REGEX = /^label_(\d+)_(\w+)$/;