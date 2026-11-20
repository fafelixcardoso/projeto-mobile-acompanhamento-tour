package br.uel.acomp_tour.controller;

import br.uel.acomp_tour.model.Restaurante;
import br.uel.acomp_tour.service.RestauranteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurantes")
public class RestauranteController {

    private final RestauranteService restauranteService;

    @Autowired
    public RestauranteController(RestauranteService restauranteService) {
        this.restauranteService = restauranteService;
    }

    @GetMapping
    public ResponseEntity<List<Restaurante>> listar(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) String ordenarPor,
            @RequestParam(required = false) String direcao) {
        return ResponseEntity.ok(restauranteService.listar(termo, ordenarPor, direcao));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurante> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(restauranteService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Restaurante> cadastrar(@Valid @RequestBody Restaurante restaurante) {
        Restaurante salvo = restauranteService.cadastrar(restaurante);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurante> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Restaurante restaurante) {
        Restaurante atualizado = restauranteService.atualizar(id, restaurante);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        restauranteService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
