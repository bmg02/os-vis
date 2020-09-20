function check_field(field) {
    return field !== undefined && field !== null && field !== '' ? true : false;
}

export { check_field };