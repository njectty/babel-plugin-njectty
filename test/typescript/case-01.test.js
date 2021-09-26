const source = `
import { Module } from 'njectty';

@Module({
    imports: [X],
    exports: [Y],
    injects: [Z],
})
class SomeModule {}
`;

const expected = `
import { Module } from "njectty/implementation";

class SomeModule {}

Module(SomeModule, {
    imports: [X],
    exports: [Y],
    injects: [Z]
});
`;

it("Case 01", () => test(source, expected));
