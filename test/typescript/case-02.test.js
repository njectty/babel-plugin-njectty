const source = `
import { Injectable } from 'njectty';

@Injectable()
class X {}

@Injectable({ global: true })
class Y {}
`;

const expected = `
import { Injectable } from "njectty/implementation";

class X {}

Injectable(X);

class Y {}

Injectable(Y, {
    opts: {
        global: true
    }
});
`;

it("Case 02", () => test(source, expected));
