const source = `
import { Inject, Injectable } from 'njectty';

@Injectable()
class X {
    @Inject() y?: Y;
}
`;

const expected = `
import { Inject, Injectable } from "njectty/implementation";

class X {
    y?: Y = Inject(Y, {
        optional: true
    });
}

Injectable(X);
`;

it("Case 05", () => test(source, expected));
