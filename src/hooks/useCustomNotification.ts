import { notification } from "antd";
import type { NotificationPlacement } from 'antd/es/notification/interface';

export function useCustomNotification() {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (customMessage: string, type: string, placement: NotificationPlacement = "topRight") => {
        let method = api.success;
        if (type === "success") {
            method = api.success;
        } else if (type === "error") {
            method = api.error;
        } else {
            method = api.info;
        }
        method({
            message: customMessage,
            placement
        });
    };

    return { openNotification, contextHolder };
}