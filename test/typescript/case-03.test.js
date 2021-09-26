const source = `
import { Inject, Injectable } from 'njectty';

@Injectable()
class X {
    @Inject() a!: A;
}

@Injectable()
class Y {
    @Inject(B) b!: string;
}
`;

const expected = `
import { Inject, Injectable } from "njectty/implementation";

class X {
    a: A = Inject(A);
}

Injectable(X);

class Y {
    b: string = Inject(B);
}

Injectable(Y);
`;

it("Case 03", () => test(source, expected));
