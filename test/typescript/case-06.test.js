const source = `
import { Inject, Injectable } from 'njectty';

@Injectable()
class X {
    @Inject(A) y?: Y;
    @Inject(B) z?: string;
}
`;

const expected = `
import { Inject, Injectable } from "njectty/implementation";

class X {
    y?: Y = Inject(A, {
        optional: true
    });
    z?: string = Inject(B, {
        optional: true
    });
}

Injectable(X);
`;

it("Case 06", () => test(source, expected));
