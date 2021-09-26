const source = `
import { Injectable, Inject, Optional } from 'njectty';

@Injectable()
class X {
    @Optional() @Inject(Y) y;

    @Inject(Z) @Optional() z;
}
`;

const expected = `
import { Injectable, Inject, Optional } from "njectty/implementation";

class X {
    y = Inject(Y, {
        optional: true
    });
    z = Inject(Z, {
        optional: true
    });
}

Injectable(X);
`;

it("Case 04", () => test(source, expected));
