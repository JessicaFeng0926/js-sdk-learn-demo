import { FieldType, IFieldMeta } from "@lark-base-open/js-sdk";
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
        if (!nameFieldMap[info.title]) {
            return { success: false, message: `当前视图缺少【${info.title}】字段，数据无法入库`, checkedFields, responseFields, labelFields, options }
        }
        if (!info.valueType.includes(nameFieldMap[info.title].type)) {
            return { success: false, message: `【${info.title}】字段的数据类型错误，数据无法入库`, checkedFields, responseFields, labelFields, options }
        }
        checkedFields.push(info.title);
        options.push({ label: info.title, value: info.title, disabled: true });
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
        else if (!REQUIRED_FIELDS.find((rf) => { return rf.title === f.name })) {
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
        if (![FieldType.Text, FieldType.Lookup].includes(field.type)) {
            return { success: false, message: `【${field.name}】字段类型错误，只能是文本或查找引用`, checkedFields, responseFields, labelFields, options }
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
        if (![FieldType.Text, FieldType.SingleSelect, FieldType.MultiSelect].includes(f.type)) {
            return { success: false, message: `【${f.name}】字段类型错误，只能是文本、单选或多选`, checkedFields, responseFields, labelFields, options }
        }

        checkedFields.push(f.name);
        labelFields[n - 1].push(f.name);
        options.push({ label: f.name, value: f.name, disabled: true })

    })




    return { success: true, message: ``, checkedFields, responseFields, labelFields, options }

}