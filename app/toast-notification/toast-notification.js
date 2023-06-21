import "../../components/toast-notification/toast-notification-actions.js";

export default class ToastNotification extends crs.classes.BindableElement {
    get html() {
        return import.meta.url.replace(".js", ".html");
    }

    get shadowDom() {
        return true;
    }

    async connectedCallback() {
        await super.connectedCallback();
        await crs.call("toast_notification", "enable", { position: "bottom-center", margin: 10 });
    }

    async disconnectedCallback() {
        await crs.call("toast_notification", "disable", {});
        await super.disconnectedCallback();
    }

    async showToast() {
        await crs.call("toast_notification", "show", { message: "This is a toast notification", severity: "info", action: {
            caption: "Action",
            callback: () => console.log("action performed")
        }});

        await crs.call("toast_notification", "show", { message: "ERROR: This is a toast notification", severity: "error" });
        await crs.call("toast_notification", "show", { message: "WARNING: This is a toast notification", severity: "warning" });
        await crs.call("toast_notification", "show", { message: "SUCCESS: This is a toast notification", severity: "success" });
    }

    async multiLine() {
        await crs.call("toast_notification", "show", { message: "WARNING: This is a toast notification\nLine2\nLine3", severity: "warning" });
    }
}