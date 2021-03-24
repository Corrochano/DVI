// Práctica 1 DVI - Álvaro Corrochano López

var cartas = new Array();

/**
 * Declaracion de la clase.
 */
class MemoryGame
{
    /**
     * Metodo principal para incializar nuestra clase.
     *
     * @return void.
     */
    MemoryGame(gs){
        //Variables que estaran disponibles en el scope global
        //de la clase
        this.valor_a = 0;
        this.valor_b = 0;
        console.log("Se genero la instancia de CalculadoraUsandoClass");
    }//constructor
    
    //=================================================//
    
    /**
     * Metodo para definir los valores de la clase
     *
     * @param Integer valor_a Primer valor.
     * @param Integer valor_b Segundo valor.
     *
     * @return void.
     */
    setValores(valor_a, valor_b)
    {
        this.valor_a = valor_a;
        this.valor_b = valor_b;
        console.log(`El valor de a es => ${this.valor_a}`);
        console.log(`El valor de b es => ${this.valor_b}`);
    }//setValores

}//CalculadoraUsandoClass
