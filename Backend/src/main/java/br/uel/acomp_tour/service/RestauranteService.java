package br.uel.acomp_tour.service;

import br.uel.acomp_tour.exception.RestauranteNaoEncontradoException;
import br.uel.acomp_tour.model.Restaurante;
import br.uel.acomp_tour.repository.RestauranteRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestauranteService {

    private final RestauranteRepository restauranteRepository;

    public RestauranteService(RestauranteRepository restauranteRepository) {
        this.restauranteRepository = restauranteRepository;
    }

    public List<Restaurante> listar(String termo, String ordenarPor, String direcao) {
        String campo = (ordenarPor != null && !ordenarPor.isBlank()) ? ordenarPor : "nome";
        Sort.Direction dir = "DESC".equalsIgnoreCase(direcao) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(dir, campo);

        if (termo != null && !termo.isBlank()) {
            return restauranteRepository.findByNomeContainingIgnoreCase(termo.trim(), sort);
        }
        return restauranteRepository.findAll(sort);
    }

    public Restaurante buscarPorId(Long id) {
        return restauranteRepository.findById(id)
                .orElseThrow(() -> new RestauranteNaoEncontradoException(id));
    }

    public Restaurante cadastrar(Restaurante r) {
        if (restauranteRepository.existsByNome(r.getNome())) {
            throw new DataIntegrityViolationException("Já existe um restaurante com esse nome.");
        }
        return restauranteRepository.save(r);
    }

    public Restaurante atualizar(Long id, Restaurante r) {
        Restaurante restaurante = restauranteRepository.findById(id)
                .orElseThrow(() -> new RestauranteNaoEncontradoException(id));

        if (restauranteRepository.existsByNomeAndIdNot(r.getNome(), id)) {
            throw new DataIntegrityViolationException("Já existe outro restaurante com esse nome.");
        }

        restaurante.setNome(r.getNome());
        restaurante.setEndereco(r.getEndereco());
        restaurante.setComentario(r.getComentario());
        restaurante.setEconomia(r.getEconomia());
        restaurante.setAvaliacao(r.getAvaliacao());
        restaurante.setDataVisita(r.getDataVisita());

        return restauranteRepository.save(restaurante);
    }

    public void excluir(Long id) {
        if (!restauranteRepository.existsById(id)) {
            throw new RestauranteNaoEncontradoException(id);
        }
        restauranteRepository.deleteById(id);
    }
}
