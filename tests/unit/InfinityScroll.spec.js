import { shallowMount } from '@vue/test-utils'
import InfinityScroll from '@/components/InfinityScroll.vue'
import scroll from '@/components/scroll'
import axios from 'axios'

const nextTick = Promise.resolve();

jest.mock('@/components/scroll')

describe('InifinityScroll', () => {
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
    return shallowMount(InfinityScroll, config);
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

  it('shows initial items', () => {
    const wrapper = buildComponent({
      propsData: {
        items: [
          { id: 1, img: 'https://placekitten.com/10/20' },
          { id: 2, img: 'https://placekitten.com/10/30' },
          { id: 3, img: 'https://placekitten.com/20/10' },
        ],
      },
    });

    expect(wrapper.findAll('.item').length).toEqual(3);
  })

  it('do not show items wrapper if there are no items to be displayed', () => {
    const wrapper = buildComponent();
    expect(wrapper.find('.items').exists()).toEqual(false);
  })

  it('load more items on button click', async () => {
    const wrapper = buildComponent();
    axios.get.mockResolvedValue({ data: [{ id: 9, img: 'spam' }] });

    wrapper.find('.load-more').trigger('click');
    await nextTick;

    expect(wrapper.findAll('.item').length).toBeGreaterThan(0);
  })

  it('fetches 10 items by default from the backend', async () => {
    const wrapper = buildComponent();

    wrapper.find('.load-more').trigger('click');

    expect(axios.get).toBeCalledWith('/my-server', { params: { max: 10 } });
  })

  it('sends how many items can be fetched from the backend', async () => {
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
