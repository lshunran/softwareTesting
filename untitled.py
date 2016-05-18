import asyncio
import aiohttp



async def fetch_page(session, url, payload):
	async with session.post(url,
	                        data=payload) as resp:
	    print(await resp.text())


payload = {'mins': '100', 'times': '2','remains':'30'}
url = 'http://localhost:7777/charging'

loop = asyncio.get_event_loop()
with aiohttp.ClientSession(loop=loop) as session:
    loop.run_until_complete(fetch_page(session, url, payload))