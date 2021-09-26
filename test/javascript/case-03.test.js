const source = `
import { Inject, Injectable } from 'njectty';

@Injectable()
class X {
    @Inject(Y) y;
}
`;

const expected = `
import { Inject, Injectable } from "njectty/implementation";

class X {
    y = Inject(Y);
}

Injectable(X);
`;

it("Case 03", () => test(source, expected));
