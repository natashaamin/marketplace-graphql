const formatDateTimeCustom = (isoString: any) => {
    if(isoString === undefined) return;
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export {
    formatDateTimeCustom,
}