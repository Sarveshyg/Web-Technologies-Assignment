package com.scorecraft.model;
import java.time.Instant; import java.util.*;
public class Match {
 public String id, title, venue, status, toss, format; public int overs, currentOver, balls; public Team home, away; public Instant updatedAt;
 public Match(String id,String title,String venue,String status,String toss,String format,int overs,Team home,Team away){this.id=id;this.title=title;this.venue=venue;this.status=status;this.toss=toss;this.format=format;this.overs=overs;this.home=home;this.away=away;this.updatedAt=Instant.now();}
 public record Team(String name,String shortName,int score,int wickets,double runRate,List<Player> players){}
 public record Player(String name,String role,int runs,int balls,int fours,int sixes,boolean striker,int wickets,double economy){}
}
