package services;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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

import beans.Korisnik;
import beans.Kupac;
import beans.Oglas;
import beans.Poruka;
import beans.Prodavac;
import dao.KategorijaDAO;
import dao.KorisnikDAO;
import dao.OglasDAO;

@Path("/korisnici")
public class KorisnikService {
	@Context
	ServletContext ctx;
	@Context
	HttpServletRequest request;

	public KorisnikService() {

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

	@POST
	@Path("/registracija")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response registracija(Kupac k) {
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnici");
		Map<String, Korisnik> mapa = korisnikDAO.getKorisnici();
		Korisnik ulogovani = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovani != null) {
			return Response.status(400).entity("Nemoguce je registrovati novog korisnika dok ste prijavljeni.").build();
		}

		if (k.getKorisnickoIme().equals("") || k.getLozinka().equals("") || k.getIme().equals("")
				|| k.getPrezime().equals("") || k.getTelefon() == null || k.getGrad().equals("")
				|| k.getEmail().equals("")) {
			return Response.status(400).entity("Niste popunili sva obavezna polja.").build();
		}

		if (k.getTelefon() < 0) {
			return Response.status(400).entity("Broj telefona ne moze biti negativan.").build();
		}
		java.util.regex.Pattern p = java.util.regex.Pattern.compile("[A-Z][a-zA-Z ]*");
		java.util.regex.Matcher m = p.matcher(k.getIme());

		if (!m.matches()) {
			return Response.status(400).entity("Niste uneli ime u ispravnom formatu.").build();
		}
		p = java.util.regex.Pattern.compile("[A-Z][a-zA-Z ]*");
		m = p.matcher(k.getPrezime());

		if (!m.matches()) {
			return Response.status(400).entity("Nista uneli prezime u ispravnom formatu.").build();
		}
		p = java.util.regex.Pattern.compile("[A-Z][a-zA-Z ]*");
		m = p.matcher(k.getGrad());

		if (!m.matches()) {
			return Response.status(400).entity("Niste uneli grad u ispravnom formatu.").build();
		}

		if (!mapa.containsKey(k.getKorisnickoIme())) {
			korisnikDAO.dodajKorisnika(k);
			return Response.status(200).build();
		} else {
			return Response.status(400).entity("Korisnicko ime koje ste uneli vec postoji.").build();
		}
	}

	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(Korisnik k) {
		Korisnik ulogovani = (Korisnik) request.getSession().getAttribute("ulogovani");
		KorisnikDAO korisnikDAO = (KorisnikDAO) ctx.getAttribute("korisnici");
		Map<String, Korisnik> mapa = korisnikDAO.getKorisnici();

		if (ulogovani != null) {
			return Response.status(400).entity("Trenutno ste prijavljeni na ovaj nalog.").build();
		}

		if (k.getKorisnickoIme().equals("") || k.getLozinka().equals("")) {
			return Response.status(400).entity("Niste uneli korisnicko ime i/ili lozinku.").build();
		}

		Korisnik korisnik = (Korisnik) mapa.get(k.getKorisnickoIme());

		if (korisnik != null && korisnik.getLozinka().equals(k.getLozinka())) {
			request.getSession().setAttribute("ulogovani", korisnik);
			return Response.ok(korisnik).build();
		} else {
			return Response.status(400).entity("Pogresno korisnicko ime i/ili lozinka.").build();
		}
	}

	@POST
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	public Response logout() {
		Korisnik ulogovani = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovani == null) {
			return Response.status(400).entity("Nema prijavljenih naloga.").build();
		}
		request.getSession().invalidate();

		return Response.status(200).build();
	}

	@GET
	@Path("/users")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getKorisnici() {
		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		Collection<Korisnik> korisnici = kd.Korisnici();

		return Response.ok(korisnici).build();
	}

	@GET
	@Path("/ulogovani")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUlogovani() {
		Korisnik ulogovani = (Korisnik) request.getSession().getAttribute("ulogovani");

		return Response.ok(ulogovani).build();
	}

	@POST
	@Path("/parametri")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response pretraziOglase(Map<String, String> parametri) {
		KorisnikDAO dao = (KorisnikDAO) ctx.getAttribute("korisnici");
		String ime = (String) parametri.get("ime");
		String grad = (String) parametri.get("grad");

		return Response.ok(dao.pretrazi(ime, grad)).build();
	}

	@GET
	@Path("/{korisnickoIme}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getProfil(@PathParam("korisnickoIme") String korisnickoIme) {
		KorisnikDAO korDao = (KorisnikDAO) ctx.getAttribute("korisnici");
		OglasDAO oglDao = (OglasDAO) ctx.getAttribute("oglasi");
		HashMap<String, Object> mapa = new HashMap<String, Object>();
		Korisnik k = korDao.getKorisnik(korisnickoIme);
		mapa.put("korisnik", k);

		if (k.getUloga().equals("Kupac")) {
			Kupac kupac = (Kupac) k;
			HashMap<String, Oglas> poruceni = new HashMap<String, Oglas>();
			HashMap<String, Oglas> omiljeni = new HashMap<String, Oglas>();

			for (int i = 0; i < kupac.getPoruceniProizvodi().size(); i++) {
				Oglas oglas = oglDao.getOglas(kupac.getPoruceniProizvodi().get(i));
				poruceni.put(oglas.getNaziv(), oglas);
			}

			for (int i = 0; i < kupac.getOmiljeniOglasi().size(); i++) {
				Oglas oglas = oglDao.getOglas(kupac.getOmiljeniOglasi().get(i));
				omiljeni.put(oglas.getNaziv(), oglas);
			}

			mapa.put("poruceni", poruceni);
			mapa.put("dostavljeni", kupac.getDostavljeniProizvodi());
			mapa.put("omiljeni", omiljeni);
		} else if (k.getUloga().equals("Prodavac")) {
			Prodavac p = (Prodavac) k;
			HashMap<String, Oglas> objavljeni = new HashMap<String, Oglas>();

			for (int i = 0; i < p.getObjavljeniOglasi().size(); i++) {
				Oglas oglas = oglDao.getOglas(p.getObjavljeniOglasi().get(i));
				objavljeni.put(oglas.getNaziv(), oglas);
			}

			mapa.put("objavljeni", objavljeni);
		}

		return Response.ok(mapa).build();
	}

	@PUT
	@Path("/izmena")
	@Produces(MediaType.APPLICATION_JSON)
	public Response izmeniKorisnika(Korisnik k) {
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");
		if (ulogovan == null || !ulogovan.getUloga().equals("Administrator")) {
			return Response.status(400).entity("Samo administrator moze da menja privilegije korisnika.").build();
		}

		KorisnikDAO korisnici = (KorisnikDAO) ctx.getAttribute("korisnici");
		Korisnik korisnik = korisnici.getKorisnik(k.getKorisnickoIme());
		// korisnici.getKorisnici().remove(korisnik.getKorisnickoIme());

		KategorijaDAO kategorije = (KategorijaDAO) ctx.getAttribute("kategorije");
		OglasDAO oglasi = (OglasDAO) ctx.getAttribute("oglasi");
		String contextPath = ctx.getRealPath("");

		if (!korisnik.getUloga().equals(k.getUloga())) {
			if (korisnik.getUloga().equals("Prodavac")) {
				Prodavac p = (Prodavac) korisnik;
				for (String naziv : p.getObjavljeniOglasi()) {
					Oglas o = oglasi.getOglas(naziv);
					kategorije.ukloniOglas(naziv);

					for (String korisnickoIme : o.getKorisnici()) {
						Kupac kupac = (Kupac) korisnici.getKorisnik(korisnickoIme);
						kupac.getOmiljeniOglasi().remove(naziv);
					}
					oglasi.ukloniOglas(naziv);
				}
			} else {
				Kupac kupac = (Kupac) korisnik;

				for (String naziv : kupac.getOmiljeniOglasi()) {
					Oglas temp = oglasi.getOglas(naziv);
					temp.setBrojOmiljenih(temp.getBrojOmiljenih() - 1);
					temp.getKorisnici().remove(kupac.getKorisnickoIme());
				}

				for (String naziv : kupac.getPoruceniProizvodi()) {
					Oglas temp = oglasi.getOglas(naziv);
					temp.setAktivan(0);
				}

				for (Oglas oglas : kupac.getDostavljeniProizvodi()) {
					Oglas temp = oglasi.getOglas(oglas.getNaziv());

					if (temp.getPorucilac().equals(kupac.getKorisnickoIme())) {
						temp.setAktivan(0);
					}
				}
			}

			if (k.getUloga().equals("Kupac")) {
				korisnici.setKupac(k);
			} else if (k.getUloga().equals("Prodavac")) {
				korisnici.setProdavac(k);
			} else {
				korisnici.setAdmin(k);
			}
		}

		korisnici.sacuvajKorisnike(contextPath);
		oglasi.sacuvajOglase(contextPath);
		kategorije.sacuvajKategorije(contextPath);

		return getProfil(k.getKorisnickoIme());
	}

	@PUT
	@Path("/lajk/{korisnickoIme}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response lajkujProdavca(@PathParam("korisnickoIme") String korisnickoIme) {
		try {
			korisnickoIme = java.net.URLDecoder.decode(korisnickoIme, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");
		if (ulogovan == null || !ulogovan.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Samo kupci mogu da lajkuju prodavca.").build();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		Prodavac prodavac = (Prodavac) kd.getKorisnik(korisnickoIme);
		Kupac kupac = (Kupac) kd.getKorisnik(ulogovan.getKorisnickoIme());

		if (!kupac.getOcene().contains(korisnickoIme)) {
			prodavac.setBrojLajkova(prodavac.getBrojLajkova() + 1);
			kupac.getOcene().add(korisnickoIme);

			return Response.status(200).build();
		} else {
			return Response.status(400).entity("Vec ste ocenili prodavaca.").build();
		}
	}

	@PUT
	@Path("/dislajk/{korisnickoIme}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response dislajkujProdavca(@PathParam("korisnickoIme") String korisnickoIme) {
		try {
			korisnickoIme = java.net.URLDecoder.decode(korisnickoIme, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null || !ulogovan.getUloga().equals("Kupac")) {
			return Response.status(400).entity("Samo kupci mogu da dislajkuju prodavca.").build();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		Prodavac prodavac = (Prodavac) kd.getKorisnik(korisnickoIme);
		Kupac kupac = (Kupac) kd.getKorisnik(ulogovan.getKorisnickoIme());

		if (!kupac.getOcene().contains(korisnickoIme)) {
			prodavac.setBrojDislajkova(prodavac.getBrojDislajkova() + 1);
			kupac.getOcene().add(korisnickoIme);

			return Response.status(200).build();
		} else {
			return Response.status(400).entity("Vec ste ocenili prodavca.").build();
		}
	}

	@POST
	@Path("/posalji/{korisnickoIme}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response posaljiPoruku(@PathParam("korisnickoIme") String korisnickoIme, Poruka poruka) {

		try {
			korisnickoIme = java.net.URLDecoder.decode(korisnickoIme, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null) {
			return Response.status(400).entity("Da biste slali poruke morate biti prijavljeni.").build();
		}

		if (poruka.getNaslovPoruke().equals("") || poruka.getSadrzajPoruke().equals("")) {
			return Response.status(400).entity("Niste popunili sva obavezna polja").build();
		}

		DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date();
		String datum = df.format(date);
		poruka.setDatumIVreme(datum);

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		Korisnik posiljalac = kd.getKorisnik(poruka.getPosiljalac());
		Korisnik primalac = kd.getKorisnik(korisnickoIme);

		int idPrimalac = primalac.getPoruke().size();
		int idPosiljalac = posiljalac.getPoruke().size();

		poruka.setId(idPrimalac);
		poruka.setPar(idPosiljalac);

		if (posiljalac.getUloga().equals("Kupac") && primalac.getUloga().equals("Prodavac")) {
			poruka.setOdgovor(true);
		}
		primalac.getPoruke().add(poruka);

		String contextPath = ctx.getRealPath("");
		kd.sacuvajKorisnike(contextPath);

		return Response.ok().build();
	}

	@PUT
	@Path("/izmeni/{korisnickoIme}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response izmeniPoruku(@PathParam("korisnickoIme") String korisnickoIme, Poruka poruka) {
		try {
			korisnickoIme = java.net.URLDecoder.decode(korisnickoIme, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null) {
			return Response.status(400).entity("Da biste izmenili poruku morate biti ulogovani.").build();
		}

		if (poruka.getSadrzajPoruke().equals("")) {
			return Response.status(400).entity("Niste uneli sva obavezna polja").build();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		Korisnik primalac = kd.getKorisnik(korisnickoIme);
		primalac.getPoruke().set(poruka.getId(), poruka);

		String contextPath = ctx.getRealPath("");
		kd.sacuvajKorisnike(contextPath);

		return Response.ok(korisnickoIme).build();
	}

	@DELETE
	@Path("/poruka/obrisi/{korisnickoIme}/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response obrisiPoruku(@PathParam("korisnickoIme") String korisnickoIme, @PathParam("id") int id) {
		try {
			korisnickoIme = java.net.URLDecoder.decode(korisnickoIme, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovani");

		if (ulogovan == null) {
			return Response.status(400).entity("Da biste obrisali poruku morate biti ulogovani.").build();
		}

		KorisnikDAO kd = (KorisnikDAO) ctx.getAttribute("korisnici");
		Korisnik primalac = kd.getKorisnik(korisnickoIme);
		primalac.getPoruke().get(id).setObrisana(true);

		String contextPath = ctx.getRealPath("");
		kd.sacuvajKorisnike(contextPath);

		return getProfil(korisnickoIme);
	}
	
	@PUT
	@Path("/zabrana/{korisnickoIme}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response ukloniZabranu(@PathParam("korisnickoIme") String korisnickoIme) {
		try {
			korisnickoIme = java.net.URLDecoder.decode(korisnickoIme, StandardCharsets.UTF_8.name());
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		Korisnik logged = (Korisnik) request.getSession().getAttribute("ulogovani");
		if(logged == null || !logged.getUloga().equals("Administrator")) {
			return Response.status(400).entity("Samo administrator moze ukloniti zabranu.").build();
		}
		
		KorisnikDAO korisnikDao = (KorisnikDAO) ctx.getAttribute("korisnici");
		Prodavac p = (Prodavac) korisnikDao.getKorisnik(korisnickoIme);
		p.setPrijave(0);
		String contextPath = ctx.getRealPath("");
		korisnikDao.sacuvajKorisnike(contextPath);
		return getProfil(korisnickoIme);
	}
}
