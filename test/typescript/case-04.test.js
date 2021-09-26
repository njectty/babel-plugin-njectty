const source = `
import { Inject, Injectable } from 'njectty';

@Injectable()
class X {
    constructor(
        private a: A,
        @Inject(Y) private b: B,
        c: C,
        @Inject(Y) d: string,
    ) {}
}
`;

const expected = `
import { Inject, Injectable } from "njectty/implementation";

class X {
    constructor(
        private a: A,
        private b: B,
        c: C,
        d: string
    ) {}

}

Injectable(X, {
    args: [A, Y, C, Y],
    argsOptions: [null, null, null, null]
});
`;

it("Case 04", () => test(source, expected));
