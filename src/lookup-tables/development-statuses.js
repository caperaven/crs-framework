const statusTranslations = globalThis.translations.treeTranslations.developmentStatus;

export const developmentStatuses = Object.freeze({
    DeletedConfirmed: {
        icon: "deleted-awaiting-confirmation",
        title: statusTranslations.DeletedConfirmed,
        color: "#6BB21F"
    },
    DeletedAwaitingConfirmation: {
        icon: "deleted-awaiting-confirmation",
        title: statusTranslations.DeletedAwaitingConfirmation,
        color: "#6BB21F"
    },
    ModifiedAwaitingConfirmation: {
        icon: "modified-awaiting-confirmation",
        title: statusTranslations.ModifiedAwaitingConfirmation,
        color: "#6BB21F"
    },
    ModifiedUnderDevelopment: {
        icon: "modified-under-development",
        title: statusTranslations.ModifiedUnderDevelopment,
        color: "#6BB21F"
    },
    NewAwaitingConfirmation: {
        icon: "new-awaiting-confirmation",
        title: statusTranslations.NewAwaitingConfirmation,
        color: "#6BB21F"
    },
    NewUnderDevelopment: {
        icon: "new-under-development",
        title: statusTranslations.NewUnderDevelopment,
        color: "#6BB21F"
    },
    Confirmed: {
        icon: "confirmed",
        title: statusTranslations.Confirmed,
        color: "#6BB21F"
    }
})