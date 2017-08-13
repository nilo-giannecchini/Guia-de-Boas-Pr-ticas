describe("myFunction", function () {
    var myfunc = NS.myFunction;

    //replace “//will insert additional tests here later” with the following:
    describe("appending strings", function () {

        // verifica se a função existe na classe
        it("should be able to append 2 strings", function () {
            expect(myfunc.append).toBeDefined();
        });

        // verifica se a função corresponde ao resultado esperado
        it("should append 2 strings", function () {
            expect(myfunc.append('hello', 'world')).toEqual('hello world');
        });
    });
});