package services;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Kategorija;
import beans.Korisnik;
import beans.Kupac;
import beans.Oglas;
import beans.Prodavac;
import dao.KategorijaDAO;
import dao.KorisnikDAO;
import dao.OglasDAO;

@Path("/kategorije")
public class KategorijaService {
	@Context
	ServletContext ctx;

	@Context
	HttpServletRequest request;

	public KategorijaService() {

	}

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("korisnici") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("korisnici", new KorisnikDAO(contextPath));
		}
		if (ctx.getAttribute("kategorije") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("kategorije", new KategorijaDAO(contextPath));
		}
		if (ctx.getAttribute("oglasi") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("oglasi", new OglasDAO(contextPath));
		}
	}

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getKategorije() {
		KategorijaDAO katd = (KategorijaDAO) ctx.getAttribute("kategorije");
		Collection<Kategorija> kategorije = katd.getKategorije();

		return Response.ok(kategorije).build();
	}

	@GET
	@Path("/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getKategorija(@PathParam("naziv") String naziv) {
		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		KategorijaDAO katd = (KategorijaDAO) ctx.getAttribute("kategorije");

		return Response.ok(katd.getKategorija(naziv)).build();
	}

	@DELETE
	@Path("/obrisi/{naziv}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response obrisiKategoriju(@PathParam("naziv") String naziv) {
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null || !ulogovan.getUloga().equals("Administrator")) {
			return Response.status(400).entity("Samo administrator moze da obrise kategoriju.").build();
		}

		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		KategorijaDAO katd = (KategorijaDAO) ctx.getAttribute("kategorije");
		OglasDAO od = (OglasDAO) ctx.getAttribute("oglasi");
		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		String contextPath = ctx.getRealPath("");

		Kategorija kategorija = katd.getKategorija(naziv);

		for (String o : kategorija.getOglasi()) {
			Oglas oglas = od.getOglas(o);
			od.ukloniOglas(o);
			Prodavac prodavac = (Prodavac) kd.getKorisnik(oglas.getKorisnickoIme());
			prodavac.getObjavljeniOglasi().remove(o);

			for (String korOglas : oglas.getKorisnici()) {
				Kupac kupac = (Kupac) kd.getKorisnik(korOglas);
				kupac.getOmiljeniOglasi().remove(o);
			}
		}

		katd.ukloniKategoriju(naziv);

		kd.sacuvajKorisnike(contextPath);
		od.sacuvajOglase(contextPath);
		katd.sacuvajKategorije(contextPath);

		return getKategorije();
	}

	@PUT
	@Path("/izmeni/{naziv}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response izmeniKategoriju(@PathParam("naziv") String naziv, Kategorija kategorija) {
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null || !ulogovan.getUloga().equals("Administrator")) {
			return Response.status(400).entity("Samo administrator moze da izmeni kategoriju.").build();
		}

		try {
			naziv = java.net.URLDecoder.decode(naziv, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		KategorijaDAO katd = (KategorijaDAO) ctx.getAttribute("kategorije");
		String contextPath = ctx.getRealPath("");

		katd.izmeniKategoriju(naziv, kategorija);
		katd.sacuvajKategorije(contextPath);

		return getKategorije();
	}

	@POST
	@Path("/dodaj")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response dodajKategoriju(Kategorija kategorija) {
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null || !ulogovan.getUloga().equals("Administrator")) {
			return Response.status(400).entity("Samo administrator moze da dodaje nove kategorije.").build();
		}

		KategorijaDAO katd = (KategorijaDAO) ctx.getAttribute("kategorije");
		String contextPath = ctx.getRealPath("");

		if (katd.dodajKategoriju(kategorija)) {
			katd.sacuvajKategorije(contextPath);
			return getKategorije();
		} else {
			return Response.status(400).entity("Kategorija sa unetim nazivom vec postoji.").build();
		}
	}
}
