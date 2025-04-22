import { IFieldMeta, ITable, IView, IViewMeta } from '@lark-base-open/js-sdk'
import { create } from 'zustand'
import { FieldOptionType } from '../utils/types'
import { IntoDBMethod } from '../utils/constants'

type State = {
    table: ITable,
    view: IView,
    viewMetaList: IViewMeta[],
    viewName: string,
    fieldNameMetaMap: Record<string, IFieldMeta>,
    fieldsToSave: string[],
    fieldOptions: FieldOptionType[],
    responseFieldsToSave: string[],
    labelFieldsToSave: string[][],
    recordIds: string[],
    intoDBMethod: IntoDBMethod,

}

type Action = {
    setTable: (t: ITable) => void,
    setView: (v: IView) => void,
    setViewMetaList: (list: IViewMeta[]) => void,
    setViewName: (name: string) => void,
    setFieldNameMetaMap: (m: Record<string, IFieldMeta>) => void,
    setFieldsToSave: (names: string[]) => void,
    setFieldOptions: (options: FieldOptionType[]) => void,
    setResponseFieldsToSave: (responses: string[]) => void,
    setLabelFieldsToSave: (labels: string[][]) => void,
    setRecordIds: (ids: string[]) => void,
    setIntoDBMethod: (m: IntoDBMethod) => void,

}

// Create your store, which includes both state and (optionally) actions
const useTableDataStore = create<State & Action>((set) => ({
    table: {} as ITable,
    view: {} as IView,
    viewMetaList: [],
    viewName: "",
    fieldNameMetaMap: {},
    fieldsToSave: [],
    fieldOptions: [],
    responseFieldsToSave: [],
    labelFieldsToSave: [],
    recordIds: [],  // 这是当前视图全部可见记录的id
    intoDBMethod: IntoDBMethod.AllIn,




    setTable: (t: ITable) => set(() => ({ table: t })),
    setView: (v: IView) => set(() => ({ view: v })),
    setViewMetaList: (list: IViewMeta[]) => set(() => ({ viewMetaList: list })),
    setViewName: (name: string) => set(() => ({ viewName: name })),
    setFieldNameMetaMap: (m: Record<string, IFieldMeta>) => set(() => ({ fieldNameMetaMap: m })),
    setFieldsToSave: (names: string[]) => set(() => ({ fieldsToSave: names })),
    setFieldOptions: (options: FieldOptionType[]) => set(() => ({ fieldOptions: options })),
    setResponseFieldsToSave: (responses: string[]) => set(() => ({ responseFieldsToSave: responses })),
    setLabelFieldsToSave: (labels: string[][]) => set(() => ({ labelFieldsToSave: labels })),
    setRecordIds: (ids: string[]) => set(() => ({ recordIds: ids })),
    setIntoDBMethod: (m: IntoDBMethod) => set(() => ({ intoDBMethod: m })),


}))

export default useTableDataStore;