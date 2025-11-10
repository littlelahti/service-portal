export interface User {
    id: number;
    name: string;
    email: number;
    phone: string;
}

type ValidationResult = { issues: { message: string; path: (keyof User)[] }[] };

export function validate(user: Partial<User>): ValidationResult {
    let issues: ValidationResult['issues'] = [];

    if (!user.name) {
        issues = [...issues, { message: 'Name is required', path: ['name'] }];
    }
    if (!user.email) {
        issues = [...issues, { message: 'Email is required', path: ['email'] }];
    }
    if (!user.phone) {
        issues = [...issues, { message: 'Phone is required', path: ['phone'] }];
    }
    return { issues };
}