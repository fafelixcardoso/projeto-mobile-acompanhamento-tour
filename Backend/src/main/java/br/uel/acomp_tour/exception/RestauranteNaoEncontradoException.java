package br.uel.acomp_tour.exception;

public class RestauranteNaoEncontradoException extends RuntimeException {
    public RestauranteNaoEncontradoException(Long id) {
        super("Restaurante não encontrado com id: " + id);
    }
}
