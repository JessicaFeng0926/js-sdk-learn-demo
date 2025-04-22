import { FieldType, IField, IFieldMeta, ITable } from "@lark-base-open/js-sdk";
import { LABEL_REGEX, REQUIRED_FIELDS, RESPONSE_REGEX } from "./constants";
import { FieldOptionType } from "./types";


export const validateFields = (fields: IFieldMeta[]) => {
    const nameFieldMap: Record<string, IFieldMeta> = {};
    fields.forEach((f) => {
        nameFieldMap[f.name] = f;
    })


    // 返回默认勾选的字段 
    const checkedFields: string[] = [];
    // 返回全部排好序的response字段
    const responseFields: string[] = [];
    // 返回跟response对应的label字段
    const labelFields: string[][] = [];

    // 返回给选择入库字段用的options 除了默认勾选的字段外 剩余的个性化字段里也挑选一些数据类型能接受的让用户选择是否保存
    const options: FieldOptionType[] = [];

    // 先检验必须有的那几个固定字段名是否存在
    for (let info of REQUIRED_FIELDS) {
        if (!nameFieldMap[info]) {
            return { success: false, message: `当前视图缺少【${info}】字段，数据无法入库`, checkedFields, responseFields, labelFields, options }
        }

        checkedFields.push(info);
        options.push({ label: info, value: info, disabled: true });
    }

    // 把所有符合response正则和符合label正则的字段挑出来
    const responseRelatedFields: IFieldMeta[] = [];
    const labelRelatedFields: IFieldMeta[] = [];

    fields.forEach((f) => {
        if (RESPONSE_REGEX.test(f.name)) {
            responseRelatedFields.push(f);
        }
        else if (LABEL_REGEX.test(f.name)) {
            labelRelatedFields.push(f);
        }
        // 如果不符合两种正则 也不在必须有的固定字段里 那就说明是个性化字段 也添加到选项里 但是允许用户勾选
        else if (!REQUIRED_FIELDS.find((rf) => { return rf === f.name })) {
            options.push({ label: f.name, value: f.name, disabled: false });
        }
    })

    if (responseRelatedFields.length === 0) {
        return { success: false, message: `缺少response，数据无法入库。请至少提供一个response，字段名为response_1`, checkedFields, responseFields, labelFields, options }
    }

    if (labelRelatedFields.length === 0) {
        return { success: false, message: `缺少标注维度，数据无法入库。请至少提供一个标注维度，字段名为label_1_xxx`, checkedFields, responseFields, labelFields, options }
    }

    // 检查多个回复的数字序号是否连续
    responseRelatedFields.sort((a, b) => {
        const n1 = parseInt(a.name.split("_")[1]);
        const n2 = parseInt(b.name.split("_")[1]);
        return n1 - n2;
    })


    for (let i = 1; i <= responseRelatedFields.length; i++) {
        const field = responseRelatedFields[i - 1];
        const idealName = `response_${i}`;

        if (field.name !== idealName) {
            return { success: false, message: `response字段命名错误，请检查。正确的命名应该为【response_数字】，数字最小为1，连续增长。当前${field.name},理想${idealName}`, checkedFields, responseFields, labelFields, options }
        }

        checkedFields.push(field.name);
        responseFields.push(field.name);
        labelFields.push([]);
        options.push({ label: field.name, value: field.name, disabled: true });

    }


    // 检查有没有超出回复序号范围的标注序号
    labelRelatedFields.sort((a, b) => {
        const n1 = parseInt(a.name.split("_")[1]);
        const n2 = parseInt(b.name.split("_")[1]);
        return n1 - n2;
    })

    labelRelatedFields.forEach((f) => {
        const n = parseInt(f.name.split("_")[1]);
        if (n > responseRelatedFields.length || n < 1) {
            return { success: false, message: `标注维度【${f.name}】超出了回复的数量，回复最大序号为${responseRelatedFields.length}，无法入库`, checkedFields, responseFields, labelFields, options }
        }


        checkedFields.push(f.name);
        labelFields[n - 1].push(f.name);
        options.push({ label: f.name, value: f.name, disabled: true })

    })




    return { success: true, message: ``, checkedFields, responseFields, labelFields, options }

}

// 从全部要入库的字段里把个性化字段找出来
export const getPayloadFields = (
    fieldsToSave: string[],
    responseFieldsToSave: string[],
    labelFieldsToSave: string[][]
) => {
    const payloadFields: string[] = [];
    const flattenedLabelFields = labelFieldsToSave.reduce((acc, current) => { return acc.concat(current) }, []);
    fieldsToSave.forEach((f) => {
        if (!REQUIRED_FIELDS.includes(f) && !responseFieldsToSave.includes(f) && !flattenedLabelFields.includes(f)) {
            payloadFields.push(f);
        }
    })
    return payloadFields;

}

// 获取field名字和真正的field对象的映射 后面要用field对象来获取单元格的值
export const getFieldNameObjMap = async (fieldsToSave: string[], fieldNameMetaMap: Record<string, IFieldMeta>, table: ITable) => {
    const nameObjMap: Record<string, IField> = {};
    for (let name of fieldsToSave) {
        const fieldMeta = fieldNameMetaMap[name];
        const id = fieldMeta.id;
        const field = await table.getFieldById(id);
        if (!field) {
            return { success: false, fieldNameObjMap: {}, message: "获取字段失败" }
        }
        nameObjMap[name] = field;

    }
    return { success: true, fieldNameObjMap: nameObjMap, message: "" }
}


// 根据记录的id和要入库的全部字段来构建一条记录的数据
// const record = {
//     internal_id: "xxx",
//     uid: "xxx",
//     task_id: "xxx",
//     prompt: "xxx",
//     start_time: "xxx",
//     end_time: "xxx",
//     responses: [
//         {
//             reply: "xxx",
//             model: "response_1",
//             label_result: {
//                 label_1_consistency: "xxx",
//                 label_1_tags: "xxx",
//                 label_1_my_note: "xxx",
//             }
//         },
//         {
//             reply: "xxx",
//             model: "response_2",
//             label_result: {
//                 label_2_consistency: "xxx",
//                 label_2_tags: "xxx",
//                 label_2_my_note: "xxx",
//             }

//         },
//     ],
//     payload: {
//         hidden: {
//             my_own_thing: "xxx"
//         }
//     }
// }


export const formatOneRecord = async (
    recordId: string,
    responseFieldsToSave: string[],
    labelFieldsToSave: string[][],
    payloadFields: string[],
    fieldNameObjMap: Record<string, IField>
) => {

    const [
        internalId,
        uid,
        prompt,
        taskId,
        startTime,
        endTime,
    ] = await Promise.all([
        fieldNameObjMap["internal_id"].getCellString(recordId),
        fieldNameObjMap["uid"].getCellString(recordId),
        fieldNameObjMap["prompt"].getCellString(recordId),
        fieldNameObjMap["task_id"].getCellString(recordId),
        fieldNameObjMap["start_time"].getCellString(recordId),
        fieldNameObjMap["end_time"].getCellString(recordId),
    ]);
    console.log(internalId, uid,prompt,taskId,startTime,endTime)

    if (!internalId || !uid || !prompt || !taskId || !startTime || !endTime) {
        return { success: false, message: "获取单元格数据失败", record: {} }
    }

    const responses = [];

    for (let i = 0; i < responseFieldsToSave.length; i++) {
        const responseName = responseFieldsToSave[i];
        const reply = await fieldNameObjMap[responseName].getCellString(recordId);
        const labelResult: Record<string, string> = {};
        for (let col of labelFieldsToSave[i]) {
            const value = await fieldNameObjMap[col].getCellString(recordId);
            labelResult[col] = value;
        }
        responses.push({
            reply: reply,
            model: responseName,
            label_result: labelResult
        })

    }

    const payloadHidden: Record<string, string> = {};
    for (let f of payloadFields) {
        const value = await fieldNameObjMap[f].getCellString(recordId);
        payloadHidden[f] = value;
    }

    const record = {
        internal_id: internalId,
        uid: uid,
        task_id: taskId,
        prompt: prompt,
        start_time: startTime,
        end_time: endTime,
        responses: responses,
        payload: {
            hidden: payloadHidden
        }
    }

    return { success: true, message: "", record: record }

}

