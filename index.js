const { Builder, By } = require('selenium-webdriver');

//Dados para reset
const cpf = process.argv[2];
const birthday = process.argv[3];
const newPWD = process.argv[4];
const newPWD2 = process.argv[5];

const globalErrorHandler = () => {
    console.log("Houve um erro, verifique a janela do navegador");
    process.exit();
}

async function main() {

    console.log(cpf, birthday, newPWD);

    //Acessando portal
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://pess.portal.senaisp.edu.br/');

    //Login no portal
    driver.findElements(By.className('form-control ng-pristine ng-valid'))
        .then(inputs => {
            driver.sleep(3000);
            inputs[0].sendKeys('33855622876');
            inputs[1].sendKeys('Leo@1234');
            driver.findElement(By.className('btn-padrao'))
                .then(btn => {
                    btn.click();
                })
                .catch(globalErrorHandler)
        })
        .catch(globalErrorHandler)
    
        await driver.sleep(2000)

    //Botão perfil de acesso
    driver.findElement(By.className('btn btn-primary btnSesiAcessar'))
        .then(btn => {
            btn.click();
        })
        .catch(globalErrorHandler)

    await driver.sleep(10000);

    //Script para entrar no reset de senha
    driver.executeScript('showReiniciarSenha()');

    await driver.sleep(1000);

    //Digitação do CPF do aluno
    driver.findElement(By.id('txtCPFReiniciarSenha'))
        .then(inputCPF => {
            inputCPF.sendKeys(cpf);
            driver.sleep(3000);
            driver.findElements(By.className('btn btn-primary'))
                .then(btnReset => {
                    btnReset[18].click();
                })
                .catch(globalErrorHandler)
        })
        .catch(globalErrorHandler)

    await driver.sleep(5000);

    //iframe de confirmação dos dados pessoais do aluno
    await driver.switchTo().defaultContent();
    driver.findElement(By.id('InlineFrame1'))
        .then((iframe) => {
            driver.switchTo().frame(iframe)
                .then(() => {
                    driver.findElement(By.className('btn btn-lg btn-primary btn-block'))
                        .then(btn => {
                            btn.click();
                        })
                        .catch(globalErrorHandler)
                })
                .catch(globalErrorHandler)
        })
        .catch(globalErrorHandler)

    await driver.sleep(5000);

    //Ir direto para "O que fazer?"
    await driver.get('https://pess.portal.senaisp.edu.br/Paginas/IFrame/IFrame.aspx?Link=RegistrarSenha');

    //Digitação do CPF
    await driver.switchTo().defaultContent();
    driver.findElement(By.id('InlineFrame1'))
        .then(iframe => {
            driver.switchTo().frame(iframe)
                .then(() => {
                    driver.findElement(By.className('form-control ng-pristine ng-invalid ng-invalid-required'))
                        .then(input => {
                            input.sendKeys(cpf);
                        })
                        .catch(globalErrorHandler)
                })
                .catch(globalErrorHandler)
        })
        .catch(globalErrorHandler)

    await driver.sleep(3000)

    //Digitação da data de nascimento
    await driver.switchTo().defaultContent();
    driver.findElement(By.id('InlineFrame1'))
        .then(iframe => {
            driver.switchTo().frame(iframe)
                .then(() => {
                    driver.findElement(By.className('form-control ng-scope ng-pristine ng-invalid ng-invalid-required'))
                        .then(input => {
                            input.sendKeys(birthday);;
                            driver.findElement(By.className('btn btn-sm btn-primary pull-right btn-fontPadrao'))
                                .then(btn => {
                                    btn.click()
                                })
                                .catch(globalErrorHandler)
                        })
                        .catch(globalErrorHandler)
                })
                .catch(globalErrorHandler)
        })
        .catch(globalErrorHandler)

    await driver.sleep(3000);

    //Confirmação do termo de uso
    await driver.switchTo().defaultContent();
    driver.findElement(By.id('InlineFrame1'))
        .then(iframe => {
            driver.switchTo().defaultContent();
            driver.switchTo().frame(iframe)
                .then(() => {
                    driver.findElements(By.className('ng-pristine ng-valid'))
                        .then(checkbox => {
                            checkbox[1].click();
                        })
                        .catch(globalErrorHandler)
                    driver.sleep(3000);
                    driver.findElements(By.className('btn btn-sm btn-primary pull-right btn-fontPadrao'))
                        .then(nextButton => {
                            nextButton[1].click();
                        })
                        .catch(globalErrorHandler)
                })
                .catch(globalErrorHandler)
        })
        .catch(globalErrorHandler)

    await driver.sleep(3000)
    await driver.switchTo().defaultContent();

    //E-mail + confirmação, nova senha + confirmação
    driver.findElement(By.id('InlineFrame1'))
        .then(iframe => {
            driver.switchTo().frame(iframe)
                .then(async function () {
                    const emailInput = await driver.findElement(By.id('inputEmailPessoal'));
                    const emailInputValue = await emailInput.getAttribute('value')

                    const emailInputConfirm = await driver.findElement(By.id('inputConfirmaEmailPessoal'));
                    await emailInputConfirm.sendKeys(emailInputValue);

                    const newPWDInput = await driver.findElement(By.id('inputSenha'));
                    await newPWDInput.sendKeys(newPWD);
                    const newPWDInputConfirm = await driver.findElement(By.id('inputConfirmaSenha'));
                    await newPWDInputConfirm.sendKeys(newPWD);

                    const theLastButton = await driver.findElements(By.className('btn btn-sm btn-primary pull-right btn-fontPadrao'));
                    await theLastButton[2].click();
                })
                .then(() => {
                    driver.findElement(By.className('alert alert-success'))
                        .then(()=>{
                            console.log(`Senha resetada com sucesso ==> ${newPWD}`);
                        })
                })
                .catch(globalErrorHandler)

        })
        .catch(globalErrorHandler)
};

main();