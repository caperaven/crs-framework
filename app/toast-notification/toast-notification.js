import "./../../components/toast-notification/toat-notification-actions.js";

export default class ToastNotification extends crsbinding.classes.ViewBase {
    async connectedCallback() {
        await super.connectedCallback();

        await crs.call("toast_notification", "enable", { position: "bottom-center" });

        requestAnimationFrame(() => this.showToast());
    }

    async showToast() {
        await crs.call("toast_notification", "show", { message: "This is a toast notification", severity: "info" });
        await crs.call("toast_notification", "show", { message: "ERROR: This is a toast notification", severity: "error" });
        await crs.call("toast_notification", "show", { message: "WARNING: This is a toast notification", severity: "warning" });
        await crs.call("toast_notification", "show", { message: "SUCCESS: This is a toast notification", severity: "success" });
    }
}