package com.scorecraft.api;
import com.scorecraft.model.Match; import com.scorecraft.service.MatchService; import org.springframework.http.*; import org.springframework.web.bind.annotation.*; import org.springframework.web.servlet.mvc.method.annotation.SseEmitter; import java.util.*;
@RestController @RequestMapping("/api/matches") @CrossOrigin public class MatchController { private final MatchService service; public MatchController(MatchService s){service=s;}
 @GetMapping public Collection<Match> all(){return service.all();} @GetMapping("/{id}") public Match one(@PathVariable String id){return service.get(id);} @GetMapping(value="/stream",produces=MediaType.TEXT_EVENT_STREAM_VALUE) public SseEmitter stream(){return service.stream();}
 public record ScoreRequest(int runs,boolean wicket){} @PostMapping("/{id}/events") public Match score(@PathVariable String id,@RequestBody ScoreRequest req){if(req.runs()<0||req.runs()>6)throw new IllegalArgumentException("Runs must be between 0 and 6");return service.score(id,req.runs(),req.wicket());}
}
