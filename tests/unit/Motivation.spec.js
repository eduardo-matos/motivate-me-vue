import { shallowMount } from '@vue/test-utils'
import Motivation from '@/components/Motivation.vue'
import scroll from '@/components/scroll'
import axios from 'axios'

const nextTick = Promise.resolve();

jest.mock('@/components/scroll')

describe('Motivation', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: [] }));
  })

  afterEach(() => {
    axios.get.mockRestore();
    jest.clearAllMocks();
    scroll._offAll();
  })

  function buildComponent(config = {}) {
    return shallowMount(Motivation, config);
  }

  it('renders title when passed', () => {
    const title = 'Dummy title';
    const wrapper = buildComponent({ propsData: { title } });
    expect(wrapper.find('h1').text()).toMatch(title);
  })

  it('do not show title tag if title is empty', () => {
    const wrapper = buildComponent({ propsData: { title: '' } });
    expect(wrapper.find('h1').exists()).toEqual(false);
  })

  it('shows initial quotes', () => {
    const wrapper = buildComponent({
      propsData: {
        items: [
          { id: 1, text: 'Construa algo que seja top' },
          { id: 2, text: 'Transforme o seu lifestyle' },
          { id: 3, text: 'Viva em busca da masterização e do profissionalismo, every f*ing day' },
        ],
      },
    });

    expect(wrapper.findAll('.quote').length).toEqual(3);
    expect(wrapper.findAll('.quote').at(0).text()).toMatch('Construa algo que seja top');
    expect(wrapper.findAll('.quote').at(1).text()).toMatch('Transforme o seu lifestyle');
    expect(wrapper.findAll('.quote').at(2).text()).toMatch('Viva em busca da masterização e do profissionalismo, every f*ing day');
  })

  it('do not show quotes wrapper if there are no items to be displayed', () => {
    const wrapper = buildComponent();
    expect(wrapper.find('.quotes').exists()).toEqual(false);
  })

  it('load more quotes on button click', async () => {
    const wrapper = buildComponent();
    axios.get.mockResolvedValue({ data: [{ id: 9, img: 'spam' }] });

    wrapper.find('.load-more').trigger('click');
    await nextTick;

    expect(wrapper.findAll('.quote').length).toBeGreaterThan(0);
  })

  it('fetches 10 quotes by default from the backend', async () => {
    const wrapper = buildComponent();

    wrapper.find('.load-more').trigger('click');

    expect(axios.get).toBeCalledWith('/my-server', { params: { max: 10 } });
  })

  it('sends how many quotes can be fetched from the backend', async () => {
    const wrapper = buildComponent();

    wrapper.find('.max-items').setValue('4');
    wrapper.find('.load-more').trigger('click');

    expect(axios.get).toBeCalledWith('/my-server', { params: { max: 4 } });
  })

  it('loads more data when bottom has reached', () => {
    buildComponent();

    scroll._emit('bottom');

    expect(axios.get).toBeCalled();
    expect(scroll.on).toHaveBeenCalledWith('bottom', expect.any(Function));
  })

  it('removes event listener when component is destroyed', () => {
    const wrapper = buildComponent();

    wrapper.destroy();

    expect(scroll.on.mock.results[0].value).toHaveBeenCalled();
  })
})
